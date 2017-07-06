import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, Refresher, ToastController } from 'ionic-angular';
import { Http, URLSearchParams } from '@angular/http';
import * as SC from 'soundcloud';

import { ConferenceData } from '../../providers/conference-data';

@IonicPage({
  segment: 'session/:data:name'
})
@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  title: string;
  segment = 'top';
  clientId: string = '2t9loNQH90kzJcsFCODdigxfp325aq4z';
  musicList: any;
  topRate: string = 'top';
  kindOfTrendingMusic: string = this.topRate;

  constructor(
    public dataProvider: ConferenceData,
    public navParams: NavParams,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public http: Http
  ) {}


  goBack() {
    this.navCtrl.pop();
  }

  getPlaylist(){
    let response_url = 'https://api-v2.soundcloud.com/charts';
    let params: URLSearchParams = new URLSearchParams();
    params.set('kind', this.kindOfTrendingMusic);
    params.set('genre', this.navParams.data.data);
    params.set('limit', '50');
    params.set('linked_partitioning', '1');
    params.set('client_id', this.clientId);

    this.http.get(response_url, {search:params})
      .map((res) => res.json()).subscribe(response => {

      let filteredList = response.collection.filter((elem: any) => {
        return elem.track.duration > 30000;
      });
      console.log(response);
      this.musicList = filteredList;
    });
  }

  ionViewWillEnter() {
    this.getPlaylist();
    this.title = this.navParams.data.name;
    SC.initialize({
      client_id: this.clientId
    });

    // this.dataProvider.load().subscribe((data: any) => {
    //
    //   if (
    //     data &&
    //     data.schedule &&
    //     data.schedule[0] &&
    //     data.schedule[0].groups
    //   ) {
    //     for (const group of data.schedule[0].groups) {
    //       if (group && group.sessions) {
    //         for (const session of group.sessions) {
    //           if (session && session.id === this.navParams.data.sessionId) {
    //             this.session = session;
    //             break;
    //           }
    //         }
    //       }
    //     }
    //   }
    // });
  }

  doRefresh(refresher: Refresher) {


      // simulate a network request that would take longer
      // than just pulling from out local json file
      setTimeout(() => {
        refresher.complete();

        const toast = this.toastCtrl.create({
          message: 'Sessions have been updated.',
          duration: 3000
        });
        toast.present();
      }, 1000);
  }
}
