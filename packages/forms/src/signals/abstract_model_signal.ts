import {Signal, signal, WritableSignal} from '@angular/core';
import {
  AbstractControl,
  DISABLED,
  FormControlStatus,
  FormHooks,
  INVALID,
  PENDING,
  VALID
} from '@angular/forms/src/model/abstract_model';
import {FormArray, FormGroup, ValidationErrors} from '@angular/forms';

export abstract class AbstractSignalControl<TValue = any, TRawValue extends TValue = TValue> {
  _pendingDirty : WritableSignal<boolean> = signal(false);
  _hasOwnPendingAsyncValidator : WritableSignal<boolean> = signal(false);
  _pendingTouched : WritableSignal<boolean> = signal(false);
  //@TODO : see to transform it into signals
  _onCollectionChange = () => {};

  _updateOn?: FormHooks;

  private _parent : Signal<FormGroup|FormArray|null> = signal(null);

  public readonly value!: WritableSignal<TValue>;
  public readonly status!: WritableSignal<FormControlStatus>;
  public readonly errors!: ValidationErrors|null;
  public readonly pristine : WritableSignal<boolean> = signal(true);
  public readonly touched : WritableSignal<boolean> = signal(false);

  constructor() {

  }

  get parent() : FormGroup|FormArray|null {
    return this._parent();
  }

  get valid() : boolean {
    return this.status() === VALID;
  }

  get invalid() : boolean {
    return this.status() === INVALID;
  }

  get pending() : boolean {
    return this.status() === PENDING;
  }

  get disabled(): boolean {
    return this.status() === DISABLED;
  }

  get enable(): boolean {
    return this.status() !== DISABLED;
  }

  get dirty() : boolean {
    return !this.pristine();
  }

  get untouched() : boolean {
    return !this.touched();
  }

  markAsTouched(opts?: {parentNotify: boolean}) : void {
    this.touched.update(() => true);

    if(opts && opts.parentNotify) {
      const optsO = {onlySelf: opts.parentNotify};
      this._parent()?.markAsTouched(optsO);
    }
  }

  //@TODO : complete method
  /*markAllAsTouched() : void {
    this.markAsTouched({parentNotify: true});

    this.
  }*/

  markAsUntouched(opts?: {parentNotify?: boolean}): void {
    this.touched.update(() => false);
    this._pendingTouched.update(() => false);

    if(opts && opts.parentNotify) {
      const optsO = {onlySelf: opts.parentNotify};
      this._parent()?.markAsUntouched(optsO);
    }
  }

  abstract _hasChildren(control: AbstractControl): boolean;
  abstract _forEachChild(control: AbstractControl): AbstractControl;

}
