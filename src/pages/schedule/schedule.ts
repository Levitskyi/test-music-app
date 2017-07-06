import { Component, ViewChild } from '@angular/core';

import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

import { SessionDetailPage } from '../session-detail/session-detail';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';


interface Genre {
  data: string;
  title: string;
}
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {
  genres: Genre[] = [
    { data:'soundcloud:genres:all-music', title: 'Trending music'},
    { data:'soundcloud:genres:all-audio', title: 'Trending audio'},
    { data:'soundcloud:genres:alternativerock', title: 'Alternative Rock'},
    { data:'soundcloud:genres:ambient', title: 'Ambient'},
    { data:'soundcloud:genres:classical', title: 'Classical'},
    { data:'soundcloud:genres:country', title: 'Country'},
    { data:'soundcloud:genres:danceedm', title: 'Dance & EDM'},
    { data:'soundcloud:genres:dancehall', title: 'Dancehall'},
    { data:'soundcloud:genres:deephouse', title: 'Deep House'},
    { data:'soundcloud:genres:disco', title: 'Disco'},
    { data:'soundcloud:genres:drumbass', title: 'Drum & Bass'},
    { data:'soundcloud:genres:dubstep', title: 'Dubstep'},
    { data:'soundcloud:genres:electronic', title: 'Electronic'},
    { data:'soundcloud:genres:folksingersongwriter', title: 'Folk & Singer-Songwriter'},
    { data:'soundcloud:genres:hiphoprap', title: 'Hip Hop & Rap'},
    { data:'soundcloud:genres:house', title: 'House'},
    { data:'soundcloud:genres:indie', title: 'Indie'},
    { data:'soundcloud:genres:jazzblues', title: 'Jazz & Blues'},
    { data:'soundcloud:genres:latin', title: 'Latin'},
    { data:'soundcloud:genres:metal', title: 'Metal'},
    { data:'soundcloud:genres:piano', title: 'Piano'},
    { data:'soundcloud:genres:pop', title: 'Pop'},
    { data:'soundcloud:genres:rbsoul', title: 'R&B & Soul'},
    { data:'soundcloud:genres:reggae', title: 'Reggae'},
    { data:'soundcloud:genres:reggaeton', title: 'Reggaeton'},
    { data:'soundcloud:genres:rock', title: 'Rock'},
    { data:'soundcloud:genres:soundtrack', title: 'Soundtrack'},
    { data:'soundcloud:genres:techno', title: 'Techno'},
    { data:'soundcloud:genres:trance', title: 'Trance'},
    { data:'soundcloud:genres:trap', title: 'Trap'},
    { data:'soundcloud:genres:triphop', title: 'Trip Hop'},
    { data:'soundcloud:genres:world', title: 'World'},
    { data:'soundcloud:genres:audiobooks', title: 'Audiobooks'},
    { data:'soundcloud:genres:business', title: 'Business'},
    { data:'soundcloud:genres:comedy', title: 'Comedy'},
    { data:'soundcloud:genres:entertainment', title: 'Entertainment'},
    { data:'soundcloud:genres:learning', title: 'Learning'},
    { data:'soundcloud:genres:newspolitics', title: 'News & Politics'},
    { data:'soundcloud:genres:religionspirituality', title: 'Religion & Spirituality'},
    { data:'soundcloud:genres:science', title: 'Science'},
    { data:'soundcloud:genres:sports', title: 'Sports'},
    { data:'soundcloud:genres:storytelling', title: 'Storytelling'},
    { data:'soundcloud:genres:technology', title: 'Technology'}
  ];
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('scheduleList', { read: List }) scheduleList: List;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public confData: ConferenceData,
    public user: UserData,
  ) {}

  ionViewDidLoad() {
    this.app.setTitle('Schedule');
    this.updateSchedule();
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    this.scheduleList && this.scheduleList.closeSlidingItems();

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      console.log(data);
      this.groups = data.groups;
    });
  }

  presentFilter() {
    let modal = this.modalCtrl.create(ScheduleFilterPage, this.excludeTracks);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        this.excludeTracks = data;
        this.updateSchedule();
      }
    });

  }

  goToSessionDetail(sessionData: any) {
    // go to the session detail page
    // and pass in the session data

    this.navCtrl.push(SessionDetailPage, { data: sessionData.data, name: sessionData.title });
  }

  addFavorite(slidingItem: ItemSliding, sessionData: any) {

    if (this.user.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(sessionData.name);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, sessionData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  openSocial(network: string, fab: FabContainer) {
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }

  doRefresh(refresher: Refresher) {
    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;

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
    });
  }
}
