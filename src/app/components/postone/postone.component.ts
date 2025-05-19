import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-postone',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './postone.component.html',
  styleUrls: ['./postone.component.css']
})
export class PostoneComponent {

  post = {
    username: 'Shahd Mostafa',
    job: 'Marketer | Public Speaker | Influencer',
    time: '1w',
    text: `هل تريد أن تجعل علامتك التجارية حديث الجميع؟! هل لديك منتج أو خدمة رائعة ولكن لا؟ 📝
          تعرف كيف تصل إلى جمهورك المستهدف؟ 🤔 التسويق هو المفتاح السحري لنجاح أي مشروع، سواء كنت صاحب مشروع ناشئ أو شركة قائمة،
          التسويق الصح هو اللي هيكبر اسمك! متخليش مجهودك يضيع، خليك ذكي وابدأ حملتك التسويقية دلوقتي 💡📢`,
    image: 'https://i.pinimg.com/736x/36/d9/a2/36d9a22e85ffa3d9aaac33f78a98153a.jpg'
  };

  comments = [
    {
      username: 'Ahmed',
      text: 'تعليق جميل جدًا!',
      time: '1h ago',
      replies: [] as { username: string, text: string, time: string }[],  // تأكد من أن الردود كائنات بالشكل الصحيح
      replyText: '',
      likes: 5
    }
  ];

  showComments: boolean = false;
  liked: boolean = false;
  commentText: string = '';
  showReplies: boolean[] = [];


  toggleComments(): void {
    this.showComments = !this.showComments;
  }


  likePost(): void {
    this.liked = !this.liked;
  }
  commentPost(): void {
    if (this.commentText.trim()) {
      this.comments.push({
        username: 'Shahd',  
        text: this.commentText,
        time: 'just now',
        replies: [],
        replyText: '',
        likes: 0
      });
      this.commentText = '';
    }
  }


  likeComment(index: number): void {
    this.comments[index].likes += 1;
  }


  toggleReply(index: number): void {
    this.showReplies[index] = !this.showReplies[index];
  }


  replyToComment(index: number): void {
    if (this.comments[index].replyText.trim()) {
      const reply = {
        username: 'Shahd',
        text: this.comments[index].replyText,
        time: new Date().toLocaleTimeString()
      };
      this.comments[index].replies.push(reply);
      this.comments[index].replyText = '';
    }
  }

  // وظيفة للمشاركة
  sharePost(): void {
    console.log("Post shared!");
  }
}
