import { test, beforeEach, expect, vi } from "vitest";
import {
  getProfile,
  getMyPlaylists,
  getPlayer,
  getCategories,
  getCategoryPlaylists,
  getMyTopGenres,
  searchResults,
  getSavedTracks,
} from "./spotify";

import { MockedFunction } from "vitest";

declare var global: any;

beforeEach(() => {
  global.fetch = vi.fn();
});

test("getProfile", async () => {
  const token = "token";
  const profile = { display_name: "test" };

  (fetch as MockedFunction<typeof fetch>).mockResolvedValue({
    ok: true,
    json: async () => profile,
  } as Response);

  const result = await getProfile(token);

  expect(result).toEqual(profile);

  expect(fetch).toHaveBeenCalledWith("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
});

test("getMyPlaylists", async () => {
  const token = "token";
  const playlists = { items: [{ name: "test" }] };

  (fetch as MockedFunction<typeof fetch>).mockResolvedValue({
    ok: true,
    json: async () => playlists,
  } as Response);

  const result = await getMyPlaylists(token);

  expect(result).toEqual(playlists);

  expect(fetch).toHaveBeenCalledWith(
    "https://api.spotify.com/v1/me/playlists",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
});

test("getPlayer", async () => {
  const token = "token";
  const player = { item: { name: "test" } };

  (fetch as MockedFunction<typeof fetch>).mockResolvedValue({
    ok: true,
    json: async () => player,
  } as Response);

  const result = await getPlayer(token);

  expect(result).toEqual(player);

  expect(fetch).toHaveBeenCalledWith("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
});

test("getCategories", async () => {
  const token = "token";
  const categoriesResponse = {
    categories: {
      items: [{ name: "test_category_1" }, { name: "test_category_2" }],
    },
  };

  (fetch as MockedFunction<typeof fetch>).mockResolvedValue({
    ok: true,
    json: async () => categoriesResponse,
  } as Response);

  const result = await getCategories(token);

  expect(result).toEqual(categoriesResponse.categories.items);

  expect(fetch).toHaveBeenCalledWith(
    "https://api.spotify.com/v1/browse/categories",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
});

test("getCategoryPlaylists - Successful fetch", async () => {
  const token = "test_token";
  const categoryId = "test_category_id";
  const playlistsResponse = {
    playlists: {
      items: [
        { name: "playlist_1" },
        { name: "playlist_2" },
        { name: "playlist_3" },
        { name: "playlist_4" },
      ],
    },
  };

  (fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => playlistsResponse,
  } as Response);

  const result = await getCategoryPlaylists(token, categoryId);

  expect(result).toEqual(playlistsResponse.playlists.items);

  expect(fetch).toHaveBeenCalledWith(
    `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
});

test("getCategoryPlaylists - API error handling", async () => {
  const token = "test_token";
  const categoryId = "test_category_id";

  (fetch as any).mockResolvedValueOnce({
    ok: false,
  } as Response);

  await expect(getCategoryPlaylists(token, categoryId)).rejects.toThrowError(
    "Failed to fetch playlists"
  );

  expect(fetch).toHaveBeenCalledWith(
    `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
});
test("getMyTopGenres", async () => {
  const accessToken = "access_token";
  const topGenresResponse = {
    items: [{ genres: ["rock", "pop"] }],
  };

  (fetch as MockedFunction<typeof fetch>).mockResolvedValue({
    ok: true,
    json: async () => topGenresResponse,
  } as Response);

  const result = await getMyTopGenres(accessToken);

  expect(result).toEqual(topGenresResponse.items[0].genres);

  expect(fetch).toHaveBeenCalledWith(
    "https://api.spotify.com/v1/me/top/artists",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
});

test("searchResults - Successful search", async () => {
  const token = "test_token";
  const query = "test_query";
  const type = "track";
  const searchResultsResponse = {
    tracks: {
      items: [{ name: "track_1" }, { name: "track_2" }],
    },
  };

  (fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => searchResultsResponse,
  } as Response);

  const result = await searchResults(token, query, type);

  expect(result).toEqual(searchResultsResponse.tracks.items);

  expect(fetch).toHaveBeenCalledWith(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=${type}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
});

test("searchResults - API error handling", async () => {
  const token = "test_token";
  const query = "test_query";
  const type = "track";
  const errorMessage = "Error en la búsqueda";

  (fetch as any).mockImplementationOnce(async () => {
    return {
      ok: false,
      json: async () => ({ error: { message: errorMessage } }),
    } as Response;
  });

  await expect(searchResults(token, query, type)).rejects.toThrowError(
    `Failed to fetch data: ${errorMessage}`
  );

  expect(fetch).toHaveBeenCalledWith(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=${type}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
});

test("searchResults - Invalid response format handling", async () => {
  const token = "test_token";
  const query = "test_query";
  const type = "track";
  const invalidResponse = {
    invalid: {
      items: [{ name: "invalid_type" }],
    },
  };

  (fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => invalidResponse,
  } as Response);

  await expect(searchResults(token, query, type)).rejects.toThrowError(
    "Invalid response format from Spotify API"
  );

  expect(fetch).toHaveBeenCalledWith(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=${type}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
});

test("getSavedTracks", async () => {
  const token = "token";
  const savedTracks = {
    items: [{ name: "saved_track_1" }, { name: "saved_track_2" }],
  };

  (fetch as MockedFunction<typeof fetch>).mockResolvedValue({
    ok: true,
    json: async () => savedTracks,
  } as Response);

  const result = await getSavedTracks(token);

  expect(result).toEqual(savedTracks.items);

  expect(fetch).toHaveBeenCalledWith("https://api.spotify.com/v1/me/tracks", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
});
