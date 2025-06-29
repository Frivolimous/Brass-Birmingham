import * as _ from 'lodash';
import { IArea, IHive } from '../data/SaveData';
import { GameHive } from './GameHive';

export class GameArea {
  public flowerSeen: number = 0;

  public pollenDelta: number = 0;
  public canAnimal = false;
  // public flowerDelta: number;

  constructor(public data: IArea) {

  }

  public update = () => {
    this.data.flowerCount += this.data.flowerRate;
    this.data.flowerCount = Math.min(this.data.flowerCount, this.data.flowerCapacity);
    this.data.pollenCount += this.data.flowerRate * this.data.pollenPerFlower;
    this.data.pollenCount = Math.min(this.data.pollenCount, this.data.flowerCapacity * this.data.pollenPerFlower);
    let dDistance = this.data.distanceOffset * this.data.flowerRate / (this.data.flowerCapacity - this.data.flowerCount || 1);
    this.data.distanceOffset -= dDistance;
    this.data.distanceOffset = Math.max(this.data.distanceOffset, 0);
    this.flowerSeen = _.sum(this.data.hiveFlowerSeen);
  }

  public getFlowerDensity() {
    return this.data.flowerCount / this.data.maxFlowerCapacity;
  }

  public consumePollen(source: GameHive, n: number) {
    this.data.pollenCount -= n;
    this.data.pollenCount = Math.max(this.data.pollenCount, 0);

    this.pollenDelta = n;

    let pollenFlowers = this.data.pollenCount / this.data.pollenPerFlower;
    let consumed = Math.floor(this.data.flowerCount - pollenFlowers);

    if (consumed >= 1) {
      this.data.flowerCount -= consumed;
      this.data.hiveFlowerSeen[source.data.id] -= consumed;
      this.data.distanceOffset += consumed;
    }
  }
}
