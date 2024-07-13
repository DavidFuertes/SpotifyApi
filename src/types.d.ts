type Playlist = {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: null | string;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
};

interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  uri: string;
}

type PlaylistRequest = {
  href: string;
  limit: number;
  next: null | string;
  offset: number;
  previous: null | string;
  total: number;
  items: Playlist[];
};

type UserProfile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  product: string;
  type: string;
  uri: string;
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
};

type Playlist = {
  name: string;
  uri: string;
};

type PlaylistRequest = {
  items: Playlist[];
};

type Category = {
  href: any;
  items: any;
  icons: any;
  id: string;
  name: string;
};

type CategoryResponse = {
  categories: {
    items: Category[];
  };
};

type TopGenresResponse = {
  items: {
    genres: string[];
  }[];
};

type UserTopGenres = string[];
