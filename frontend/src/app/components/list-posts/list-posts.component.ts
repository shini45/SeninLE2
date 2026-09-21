import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit {

  posts: Post[] = [];
  filteredPosts: Post[] = [];
  displayedPosts: Post[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 4; 
  isDescending: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.http.get<Post[]>('https://localhost:7236/api/Post')
      .subscribe({
        next: (data: Post[]) => {
          this.posts = data || [];
          this.onSearch(); 
        },
        error: (err) => console.error(err)
      });
  }

  onSearch(): void {
    let result = this.posts ? [...this.posts] : [];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.firstName + ' ' + p.lastName).toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.dateCreated).getTime();
      const dateB = new Date(b.dateCreated).getTime();
      return this.isDescending ? dateB - dateA : dateA - dateB;
    });

    this.filteredPosts = result;
    this.updatePagination();
  }

  toggleFilter(): void {
    this.isDescending = !this.isDescending;
    this.onSearch();
    alert(`Sorting order changed to: ${this.isDescending ? 'Newest First' : 'Oldest First'}`);
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedPosts = this.filteredPosts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    const maxPage = Math.ceil(this.filteredPosts.length / this.pageSize) || 1;
    if (page < 1 || page > maxPage) return;
    this.currentPage = page;
    this.updatePagination();
  }
}
