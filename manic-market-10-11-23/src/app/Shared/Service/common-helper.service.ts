import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { BehaviorSubject, Subject } from 'rxjs';
import { isNullOrUndefined } from 'util';
@Injectable({
  providedIn: 'root'
})
export class CommonHelperService {
  updateScreener = new BehaviorSubject<boolean>(false);
  adminDictonary = false;
  loginpage = new BehaviorSubject<boolean>(false);
  adminQuote = false;
  showPopup = false;
  popupMessage = '';
  profilePic = '';
  secondaryMessage = '';
  popupType = '';
  constructor() { }
  setStorage(key, value) {

    let encValue = this.encrypt(value);
    let encKey = this.encrypt(key)
    localStorage.setItem(key, encValue);
    return true;
  }

  getStorage(key) {

    let encKey = this.encrypt(key);
    let decValue = localStorage.getItem(key)
    return decValue ? this.decrypt(decValue) : undefined;
  }
  removeStorage(key) {
    let encKey = this.encrypt(key);

    localStorage.removeItem(key);

  }

  encrypt(txt) {
    return CryptoJS.AES.encrypt(txt, environment.AESKey.trim()).toString();
  }
  decrypt(txt) {
    return CryptoJS.AES.decrypt(txt, environment.AESKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  showAlert(title, msg, type) {
    this.popupMessage = title;
    this.secondaryMessage = msg;
    this.popupType = type;
    document.getElementById("openModalButton").click();
    // Swal.fire(title, msg, type)
  }

  showErrorAlert(msg) {
    this.popupMessage = 'Opps!';
    this.popupType = 'error';
    this.secondaryMessage = msg;
    document.getElementById("openModalButton").click();
    // Swal.fire('Opps!', msg, 'error')
  }
  showSuccessAlert(msg) {
    this.popupMessage = 'Success!';
    this.secondaryMessage = msg;
    this.popupType = 'success';
    document.getElementById("openModalButton").click();
    // Swal.fire('Success!', msg, 'success')
  }

  ShowConfirmAlert(msgTitle, msgText, type) {

    Swal.fire({
      title: msgTitle,
      text: msgText,
      icon: type,
      showCancelButton: true,
      confirmButtonText: 'Yes ',
      cancelButtonText: 'No',
    }).then((result) => {

      if (result.isConfirmed) {

        return true;

      } else if (result.isDismissed) {

        return false;

      }
    })

  }

  checkIsValidNumberString(num): Boolean {
   
    const regex = /^[0-9]\d*$/;
    if (num && num != null) {
      return regex.test(num);
     
    } else {
      return false;
    }

  }
  NumberOnly(event, isCommaOrDash: boolean = false): boolean {

    const charCode = event.which ? event.which : event.keyCode;
    if (isCommaOrDash) {
      if (charCode == 44 || charCode == 45) {
        return true;
      }
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
