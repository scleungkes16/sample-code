import { Injectable } from '@angular/core';

@Injectable()
export class ConfirmationService {

	public isSuccess:boolean;
  public errorCode:string;

  public channelId:string;
  public channelUId:string;
  public merchantName:string;
  public sourceAddress:string;
  public expiredDate:string;
  public expiredTime:string;
  public minPay:number;
  public totalPayment:number;

  constructor(){    
  }

  setIsSuccess(isSuccess:boolean) {
    this.isSuccess = isSuccess;
  }

  getIsSuccess() {
    return this.isSuccess;
  }

  setErrorCode(errorCode:string) {
    this.errorCode = errorCode;
  }

  getErrorCode() {
    return this.errorCode;
  }

  setChannelId(channelId:string) {
    this.channelId = channelId;
  }

  getChannelId() {
    return this.channelId;
  }

  setChannelUId(channelUId:string) {
    this.channelUId = channelUId;
  }

  getChannelUId() {
    return this.channelUId;
  }  

  setMerchantName(merchantName:string) {
    this.merchantName = merchantName;
  }

  getMerchantName() {
    return this.merchantName;
  }  

  setSourceAddress(sourceAddress:string) {
    this.sourceAddress = sourceAddress;
  }

  getSourceAddress() {
    return this.sourceAddress;
  }

  setExpiredDate(expiredDate:string) {
    this.expiredDate = expiredDate;
  }

  getExpiredDate() {
    return this.expiredDate;
  }

  setExpiredTime(expiredTime:string) {
    this.expiredTime = expiredTime;
  }

  getExpiredTime() {
    return this.expiredTime;
  }  

  setTotalPayment(totalPayment:number) {
    this.totalPayment = totalPayment;
  }

  getTotalPayment() {
    return this.totalPayment;
  }    

  setMinPay(minPay:number) {
    this.minPay = minPay;
  }

  getMinPay() {
    return this.minPay;
  }    

  reset(){
    this.isSuccess = false;
    this.errorCode = '';
    
    this.channelId = '';
    this.merchantName = '';
    this.sourceAddress = '';
    this.expiredDate = '';
    this.expiredTime = '';
    this.minPay = 0;
    this.totalPayment = 0;
  }
}