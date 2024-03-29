import axios, { type AxiosInstance } from "axios";
import { type Server } from "http";
import express from "express";

enum SongState {
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  STOPPED = "STOPPED",
}

interface GetSongResponse {
  song: string | null;
}

interface GetStateResponse {
  state: SongState;
}

interface MusicPlayerRemote {
  getSong: () => Promise<string | null>;
  getState: () => Promise<SongState>;
}

class MusicPlayer implements MusicPlayerRemote {
  private song: string | null;
  private state: SongState;

  constructor() {
    this.song = null;
    this.state = SongState.STOPPED;
  }

  pause(): void {
    if (this.song != null && this.state !== SongState.PAUSED) {
      this.state = SongState.PAUSED;
    }
  }

  play(song: string): void {
    this.song = song;
    this.state = SongState.PLAYING;
  }

  resume(): void {
    if (this.song != null && this.state !== SongState.PLAYING) {
      this.state = SongState.PLAYING;
    }
  }

  stop(): void {
    if (this.song != null && this.state !== SongState.STOPPED) {
      this.song = null;
      this.state = SongState.STOPPED;
    }
  }

  async getSong(): Promise<string | null> {
    return this.song;
  }

  async getState(): Promise<SongState> {
    return this.state;
  }
}

class MusicPlayerMonitor {
  private readonly musicPlayerRemote: MusicPlayerRemote;

  constructor(musicPlayerRemote: MusicPlayerRemote) {
    this.musicPlayerRemote = musicPlayerRemote;
  }

  async report(): Promise<void> {
    try {
      const song = await this.musicPlayerRemote.getSong();
      const state = await this.musicPlayerRemote.getState();
      console.log("---REPORT START---");
      console.log("Song", song);
      console.log("State", state);
      console.log("----REPORT END----");
      console.log();
    } catch (err) {
      console.error(err);
    }
  }
}

class MusicPlayerStub implements MusicPlayerRemote {
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string;
  private readonly getSongPath: string;
  private readonly getStatePath: string;

  constructor(baseUrl: string, getSongPath: string, getStatePath: string) {
    this.baseUrl = baseUrl;
    this.getStatePath = getStatePath;
    this.getSongPath = getSongPath;
    this.axiosInstance = axios.create({});
  }

  getSong: () => Promise<string | null> = async () => {
    const response = await this.axiosInstance.get(this.getSongPath, {
      baseURL: this.baseUrl,
    });
    const { song } = response.data as GetSongResponse;
    return song;
  };

  getState: () => Promise<SongState> = async () => {
    const response = await this.axiosInstance.get(this.getStatePath, {
      baseURL: this.baseUrl,
    });
    const { state } = response.data as GetStateResponse;
    return state;
  };
}

function setupMusicPlayerSkeleton(
  musicPlayer: MusicPlayer,
  port: number,
  getSongPath: string,
  getStatePath: string,
): Server {
  const app = express();

  app.get(getSongPath, (_req, res) => {
    const run = async (): Promise<void> => {
      const song = await musicPlayer.getSong();
      res.send({
        song,
      } satisfies GetSongResponse);
    };
    void run();
  });

  app.get(getStatePath, (_req, res) => {
    const run = async (): Promise<void> => {
      const state = await musicPlayer.getState();
      res.send({
        state,
      } satisfies GetStateResponse);
    };
    void run();
  });

  const server = app.listen(port, () => {
    console.log("music player skeleton listening on", port);
  });

  return server;
}

export async function remoteProxyPattern(): Promise<void> {
  // Monitor (Client) -> Stub (Client Helper - part of Remote Proxy) | Skeleton (Service Helper - part of Remote Proxy) -> Service
  const PORT = 8080;
  const GET_SONG_PATH = "/song";
  const GET_STATE_PATH = "/state";
  const musicPlayer = new MusicPlayer();
  const server = setupMusicPlayerSkeleton(
    musicPlayer,
    PORT,
    GET_SONG_PATH,
    GET_STATE_PATH,
  );

  await new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });

  const musicPlayerStub = new MusicPlayerStub(
    `http://localhost:${PORT}`,
    GET_SONG_PATH,
    GET_STATE_PATH,
  );
  const musicPlayerMonitor = new MusicPlayerMonitor(musicPlayerStub);

  await musicPlayerMonitor.report();

  musicPlayer.play("Future - Like That");
  await musicPlayerMonitor.report();

  musicPlayer.pause();
  await musicPlayerMonitor.report();

  musicPlayer.resume();
  await musicPlayerMonitor.report();

  musicPlayer.resume();
  await musicPlayerMonitor.report();

  musicPlayer.stop();
  await musicPlayerMonitor.report();

  musicPlayer.play("Jorja Smith - Come Over");
  await musicPlayerMonitor.report();

  musicPlayer.play("ScHoolboy Q - X");
  await musicPlayerMonitor.report();

  server.close();
}

interface HelloWorldState {
  print: () => void;
}

class HelloWorldNotLoadedState implements HelloWorldState {
  fetching: boolean;
  helloWorld: HelloWorldProxy;

  constructor(helloWorld: HelloWorldProxy) {
    this.helloWorld = helloWorld;
    this.fetching = false;
  }

  print(): void {
    console.log("loading hello world, please wait...");
    if (!this.fetching) {
      this.fetching = true;
      setTimeout(() => {
        const text = `

██╗  ██╗███████╗██╗     ██╗      ██████╗     ██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗ ██╗
██║  ██║██╔════╝██║     ██║     ██╔═══██╗    ██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗██║
███████║█████╗  ██║     ██║     ██║   ██║    ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║██║
██╔══██║██╔══╝  ██║     ██║     ██║   ██║    ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║╚═╝
██║  ██║███████╗███████╗███████╗╚██████╔╝    ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝██╗
╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝      ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝
`;
        this.helloWorld.setText(text);
        this.helloWorld.setState(this.helloWorld.getLoadedState());
        this.fetching = false;
      }, 3000);
    }
  }
}

class HelloWorldLoadedState implements HelloWorldState {
  helloWorld: HelloWorldProxy;

  constructor(helloWorld: HelloWorldProxy) {
    this.helloWorld = helloWorld;
  }

  print(): void {
    console.log(this.helloWorld.getText());
  }
}

class HelloWorldProxy {
  text: string;
  state: HelloWorldState;
  notLoadedState: HelloWorldState;
  loadedState: HelloWorldState;

  constructor() {
    this.text = "";
    this.notLoadedState = new HelloWorldNotLoadedState(this);
    this.loadedState = new HelloWorldLoadedState(this);
    this.state = this.notLoadedState;
  }

  setState(state: HelloWorldState): void {
    this.state = state;
  }

  getLoadedState(): HelloWorldState {
    return this.loadedState;
  }

  print(): void {
    this.state.print();
  }

  getText(): string {
    return this.text;
  }

  setText(text: string): void {
    this.text = text;
  }
}

export function virtualProxyPattern(): void {
  // Virtual proxy as a placeholder to expensive items
  const helloWorld = new HelloWorldProxy();
  setInterval(() => {
    helloWorld.print();
  }, 1000);
}

interface Person {
  getName: () => string;
  setName: (name: string) => void;
}

class PersonImplementation implements Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }
}

class ClientPersonProxy implements Person {
  person: Person;

  constructor(person: Person) {
    this.person = person;
  }

  getName(): string {
    return this.person.getName();
  }

  setName(_name: string): void {
    throw new Error("client cannot change the name");
  }
}

class SystemPersonProxy implements Person {
  person: Person;

  constructor(person: Person) {
    this.person = person;
  }

  getName(): string {
    return this.person.getName();
  }

  setName(name: string): void {
    this.person.setName(name);
  }
}

export function protectionProxyPattern(): void {
  // Protection proxy limits access to certain methods based on access requirements
  const getClientPersonProxy = (person: Person): Person => {
    return new ClientPersonProxy(person);
  };

  const getSystemPersonProxy = (person: Person): Person => {
    return new SystemPersonProxy(person);
  };

  const person = new PersonImplementation("John Smith");

  console.log(person.getName());
  person.setName("Clark Kent");
  console.log(person.getName());

  const clientPersonProxy = getClientPersonProxy(person);
  try {
    console.log(clientPersonProxy.getName());
    clientPersonProxy.setName("Joe Rogan");
    console.log(clientPersonProxy.getName());
  } catch (err) {
    console.error(err);
  }

  const systemPersonProxy = getSystemPersonProxy(person);
  try {
    console.log(systemPersonProxy.getName());
    systemPersonProxy.setName("Cillian Murphy");
    console.log(systemPersonProxy.getName());
  } catch (err) {
    console.error(err);
  }
}
