enum SongState {
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  STOPPED = "STOPPED",
}

abstract class Subject {
  private readonly observers: Observer[];
  private changed: boolean;

  constructor() {
    this.changed = false;
    this.observers = [];
  }

  protected setChanged(): void {
    this.changed = true;
  }

  addObserver(obs: Observer): void {
    this.observers.push(obs);
  }

  removeObserver(obs: Observer): void {
    const index = this.observers.indexOf(obs);
    if (index >= 0) {
      this.observers.splice(index, 1);
    }
  }

  protected notifyObservers(): void {
    if (!this.changed) {
      return;
    }
    for (const obs of this.observers) {
      obs.update(this);
    }
    this.changed = false;
  }
}

abstract class Observer {
  abstract update(subject: Subject): void;
}

class MusicPlayer extends Subject {
  private song: string | null;
  private state: SongState;

  constructor() {
    super();
    this.song = null;
    this.state = SongState.STOPPED;
  }

  pause(): void {
    if (this.song != null && this.state !== SongState.PAUSED) {
      this.state = SongState.PAUSED;
      this.setChanged();
    }
    this.notifyObservers();
  }

  play(song: string): void {
    this.song = song;
    this.state = SongState.PLAYING;
    this.setChanged();
    this.notifyObservers();
  }

  resume(): void {
    if (this.song != null && this.state !== SongState.PLAYING) {
      this.state = SongState.PLAYING;
      this.setChanged();
    }
    this.notifyObservers();
  }

  stop(): void {
    if (this.song != null && this.state !== SongState.STOPPED) {
      this.song = null;
      this.state = SongState.STOPPED;
      this.setChanged();
    }
    this.notifyObservers();
  }

  getSong(): string | null {
    return this.song;
  }

  getState(): SongState {
    return this.state;
  }
}

class MusicPlayerMonitor extends Observer {
  override update(subject: Subject): void {
    if (subject instanceof MusicPlayer) {
      console.log("Song -", subject.getSong());
      console.log("State -", subject.getState());
    }
  }
}

function observerPattern(): void {
  const musicPlayer = new MusicPlayer();
  const musicPlayerMonitor = new MusicPlayerMonitor();
  musicPlayer.addObserver(musicPlayerMonitor);
  musicPlayer.play("Future - Like That");
  musicPlayer.pause();
  musicPlayer.resume();
  musicPlayer.resume();
  musicPlayer.stop();
  musicPlayer.play("Jorja Smith - Come Over");
  musicPlayer.removeObserver(musicPlayerMonitor);
  musicPlayer.play("ScHoolboy Q - X");
}

export default observerPattern;
