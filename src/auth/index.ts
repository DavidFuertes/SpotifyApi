import { getProfile, getTokens, redirectToProvider } from '../api';

enum callbackResponse {
  code = "code",
  error = "error"
}

async function handleCallback(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  let callback = false;

  const code = params.get("code");
  const err = params.get("error");

  // state is a flag to know if the error/code is from the callback
  if (err) {
    localStorage.setItem("state", callbackResponse.error);
    callback = true;
  } else if (code) {
    const tokens = await getTokens(code);

    localStorage.setItem("accessToken", tokens.access_token);
    localStorage.setItem("refreshToken", tokens.refresh_token);
    localStorage.setItem("state", callbackResponse.code);

    callback = true;
  }

  if (callback) {
    document.location.href = '/';
  }
}

export function isLogged(): boolean {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return !!(accessToken && refreshToken);
}

export async function login(): Promise<void> {
  await redirectToProvider();
}

export async function logout(): Promise<void> {
  localStorage.removeItem("verifier");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  document.location.href = '/';
}

export async function init(): Promise<undefined | UserProfile> {
  const state = localStorage.getItem("state");
  localStorage.removeItem("state");

  if (state === callbackResponse.error) {
    throw new Error("error on callback");
  }

  if (state === callbackResponse.code) {
    // come from callback
  }

  await handleCallback();
  const tokens = isLogged();
  if(tokens){
    // just for check if the token is working
    return await getProfile(localStorage.getItem("accessToken")!);
  }
}
