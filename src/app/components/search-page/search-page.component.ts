import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit {
  searchQuery: string = '';
  loading: boolean = false;
  results: any[] = [];
  error: string = '';
  activeTab: string = 'all';
  searchMetrics = [
    { icon: 'bi-people-fill', value: '50K+', label: 'Users' },
    { icon: 'bi-file-text-fill', value: '100K+', label: 'Posts' },
    { icon: 'bi-play-circle-fill', value: '25K+', label: 'Videos' }
  ];
  showFilters: boolean = true;

  peopleResults = [
    {
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'Ahmed Fawzy',
      subtitle: 'Lives in Dairut El Sharif, Asyut, Egypt',
      mutualFriends: 32
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
      name: 'AhMeD AbSs',
      subtitle: 'Faculty of Arts, Assiut University',
      mutualFriends: 279
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
      name: 'Ahmed Ali',
      subtitle: 'Lives in Asyut',
      mutualFriends: 6
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
      name: 'Ahmed Sayed Ali (The Master of English)',
      subtitle: 'Physical Education Teacher at Itck Assuit',
      mutualFriends: 19
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      name: 'Ahmed Badawi',
      subtitle: 'مدرسة/عبدالرحمن علي سليمان الثانوية',
      mutualFriends: 177
    }
  ];

  ngOnInit() {
    // Initialize with empty results
    this.results = [];
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (this.searchQuery) {
      this.onSearch();
    }
  }

  getFilteredResults() {
    if (this.activeTab === 'all') {
      return this.results;
    }
    if (this.activeTab === 'people') {
      return this.results.filter(result => 'avatar' in result);
    }
    // Add more filters for other tabs as needed
    return [];
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.error = 'Please enter a search term.';
      return;
    }

    this.loading = true;
    this.results = [];
    this.error = '';

    // Simulate async search with improved error handling
    setTimeout(() => {
      try {
        const query = this.searchQuery.toLowerCase();
        const matchingPeople = this.peopleResults.filter(person =>
          person.name.toLowerCase().includes(query) ||
          person.subtitle.toLowerCase().includes(query)
        );

        if (matchingPeople.length > 0) {
          this.results = matchingPeople;
        } else {
          this.error = `No results found for "${this.searchQuery}"`;
        }
      } catch (err) {
        this.error = 'An error occurred while searching. Please try again.';
      } finally {
        this.loading = false;
      }
    }, 800);
  }
}
