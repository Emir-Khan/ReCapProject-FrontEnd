import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollepsibleChatComponent } from './collepsible-chat.component';

describe('CollepsibleChatComponent', () => {
  let component: CollepsibleChatComponent;
  let fixture: ComponentFixture<CollepsibleChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollepsibleChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollepsibleChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }); 

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
