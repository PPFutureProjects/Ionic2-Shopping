import {Component, ViewChild} from '@angular/core'
import {NavController, AlertController, ToastController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {LoginService} from '../../providors/Login.service'
import {Employee} from '../../beans/employee.bean';
import {LoadPage} from '../load/load'


import CryptoJS from 'crypto-js'; 

@Component({
    templateUrl: 'login.html'
})

export class LoginPage{

    //@ViewChild(Nav) nav: Nav;
    username: any;
    password: any;
    errorMessage: string;
    rootPage: any = LoadPage;
    loginError: string;
    loginForm: FormGroup ;
    lastTimeDataLoaded: number;
    

    constructor(private loginService: LoginService, private employee: Employee, private navCtrl: NavController, public alertCtrl: AlertController, private formBuilder: FormBuilder,private toastCtrl: ToastController){

      this.loginForm = this.formBuilder.group({
       username: ['', Validators.required],
       password: ['', Validators.required],
      });
      this.username = this.loginForm.controls['username'];
      this.password = this.loginForm.controls['password'];
      
      setTimeout(() => {
        this.init();
      }, 100);
    }

    init(){
      this.loginService.getUser().then(
          (d) => {
              if (d && d.rows && d.rows.length > 0) {
                  this.lastTimeDataLoaded = d.rows.item(0).lastTimeDataLoaded;
              }
          }, (e) => console.error(e));
    }

    login(form) {
        // let loginForm: FormGroup = form.form;
        this.loginService.login(form.username , form.password).subscribe(
            data => {
                this.employee.employeeId = data.employeeId;
                this.employee.discipline = data.discipline;
                this.employee.firstName = data.firstName;
                this.employee.lastName = data.lastName;
                this.employee.licenseNumb = data.licenseNumb;
                this.employee.title = data.title;
                this.presentToast();
                let password = CryptoJS.AES.encrypt(form.password, form.username).toString();
                if(data.title.startsWith('MS Ed'))
                  this.employee.licenseNumb= 'Certified';
                let user: Object = {
                    username: form.username,
                    pass: password,
                    employeeId: this.employee.employeeId,
                    lastTimeDataLoaded: this.lastTimeDataLoaded
                }
                this.loginService.saveUser(user).then(
                    (d) => {
                        //this.loginService.getUser().then((d)=>console.log(d),(e)=>console.error(e));
                        this.navCtrl.push(LoadPage)
                    },
                    (e) => {
                        console.error(e);
                    }
                );

                this.loginService.saveEmployee(this.employee);
            },
            error => {
                if (error.status == 401 || error.status == 403) {
                  this.loginError = "Invalid username or password";
                }else{
                    console.log("in else");
                    this.loginService.getUser().then(
                        (d) => {
                            let user =  d.rows.item(0);
                            let password = CryptoJS.AES.decrypt(CryptoJS.AES.encrypt(form.password, form.username), form.username).toString();
                            if(user.username === form.username && password === CryptoJS.AES.decrypt(user.pass, user.username).toString()){
                                this.loginService.getEmployee().then(
                                    (data) => {
                                        this.employee.employeeId = data.employeeId;
                                        this.employee.discipline = data.discipline;
                                        this.employee.firstName = data.firstName;
                                        this.employee.lastName = data.lastName;
                                        this.employee.licenseNumb = data.licenseNumb;
                                        this.employee.title = data.title;
                                        this.navCtrl.push(LoadPage)
                                    },
                                    (err) => {
                                        console.error(err);
                                       this.presentOfflineErrror();
                                    }
                                );
                            }else{
                                this.presentOfflineErrror();
                            }
                        },
                        (e) => {
                                console.error(e);
                                this.presentOfflineErrror();
                        }
                        
                    );
                  this.loginError = "There was an error while logging in. Please try again";
                }
            });
    }

    presentOfflineErrror(){
        this.loginError = "Invalid username or password. Please try again or wait until the device is online to try";
    }


  presentToast() {

      let quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
      let message = 'Welcome ' + this.employee.firstName + ' ' + this.employee.lastName + ', ' + this.employee.title 
      //+'<br><br>' + quote.quote + '<br> <span style="text-decoration: underline;">' + quote.author+"</span>";
    //   let toast = this.toastCtrl.create({
    //       message: message,
    //       //duration: 2000,
    //       position: "top"
    //   });
    //   toast.present();



      let alert = this.alertCtrl.create({
          title: "Welcome",
          subTitle: message
      });
      alert.present();
      setTimeout(() => {
              alert.dismiss();
      }, 2000);
  }

    loginError1(error){
        console.log(error);
    }

    onSubmit(){}


    quotes = [{"quote": "Problems are not stop signs, they are guidelines", "author": "Robert H. Schuller"}]

}