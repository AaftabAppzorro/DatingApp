import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';

// @Injectable({
//     providedIn: 'root'
// })
// export class MemberDetailedResolver {

//     constructor(private memberService: MembersService) {}

//     resolve(route: ActivatedRouteSnapshot): Observable<Member> {
//         return this.memberService.getMember(route.paramMap.get('username')!);
//     }

// }
export const memberDetailedResolver:ResolveFn<Member> = (route, state) => {
    const memberService = inject(MembersService);

    return memberService.getMember(route.paramMap.get('username')!);
}