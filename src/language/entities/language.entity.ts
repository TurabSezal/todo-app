import { GlobalEntity } from 'src/global.entity';
import { Column, Entity } from 'typeorm';

@Entity('language')
export class Language extends GlobalEntity {
  @Column()
  code: string;

  @Column()
  name: string;
}
