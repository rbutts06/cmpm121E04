import Phaser from "phaser";
import { loadSounds } from "../sounds.ts";
import { makeTextures } from "../textures.ts";

export const SCENES = {
  boot: "boot",
  title: "title",
  play: "play",
  cutscene: "cutscene",
} as const;

const fadeTime = 450;
const fadeColor = [4, 2, 12] as const;

const fading = new WeakSet<Phaser.Scene>();

export function fadeIn(scene: Phaser.Scene, ms = 400): void {
  scene.cameras.main.fadeIn(ms, ...fadeColor);
}

export function isFading(scene: Phaser.Scene): boolean {
  return fading.has(scene);
}

export function fadeTo(scene: Phaser.Scene, key: string, data?: object): void {
  if (fading.has(scene)) return;
  fading.add(scene);
  const camera = scene.cameras.main;
  camera.fadeOut(fadeTime, ...fadeColor);
  camera.once("camerafadeoutcomplete", () => {
    fading.delete(scene);
    scene.scene.start(key, data);
  });
}

export class Boot extends Phaser.Scene {
  constructor() {
    super(SCENES.boot);
  }

  create(): void {
    makeTextures(this);
    loadSounds(this);
    this.scene.start(SCENES.title);
  }
}
