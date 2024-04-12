import { Component } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports : [CommonModule, TabsModule, GalleryModule]
})
export class MemberDetailComponent {

  member: Member | undefined;
  images: GalleryItem[] = [];

  constructor(private memberService: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
  }

  getImages(){
    if(!this.member) return;
    for (const photo of this.member?.photos) {
      this.images.push(new ImageItem( { src: photo.url, thumb: photo.url} ) );
    }
    return this.images;
  }

  loadMember() {
    const _username = this.route.snapshot.paramMap.get('username');
    if(!_username) return;
    this.memberService.getMember(_username).subscribe({
      next: member => {
        this.member = member;
        this.getImages();
      }
    })
  }

}
