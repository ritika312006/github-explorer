import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export async function fetchUser(username) {
  const { data } = await api.get(`/api/github/${username}`);
  return data;
}

export async function fetchRepos(username, page) {
  const { data } = await api.get(`/api/github/${username}/repos?page=${page}`);
  return data;
}

export async function fetchRepoDetail(username, repo) {
  const { data } = await api.get(`/api/github/${username}/repos/${repo}`);
  return data;
}

export async function fetchTrending() {
  const { data } = await api.get('/api/github/trending/repos');
  return data;
}