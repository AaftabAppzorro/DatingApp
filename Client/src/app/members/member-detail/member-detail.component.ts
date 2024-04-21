import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { PresenceService } from 'src/app/_services/presence.service';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports : [CommonModule, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent | undefined;
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab: TabDirective | undefined;
  messages: Message[] = [];
  user?: User;

  constructor(public presenceService: PresenceService, private route: ActivatedRoute, private messageService: MessageService
    , private accountService: AccountService) 
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data['member'];
    });

    this.route.queryParams.subscribe(params => {
      //params['tab'] ? this.selectTab(params['tab']) : this.selectTab('Messages');
      params['tab'] && this.selectTab(params['tab']);
    });

    this.getImages();
  }

  getImages(){
    if(!this.member) return;
    for (const photo of this.member?.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
    return this.images;
  }

  loadMessages() {
   if(this.member){
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    });
   }
  }

  selectTab(heading: string) {
    if(this.memberTabs){
      //this.memberTabs.tabs[tabId].active = true;
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.user) this.messageService.createHubConnection(this.user, this.member.username);
    else this.messageService.stopHubConnection();
  }
}
