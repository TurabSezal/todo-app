import { GlobalEntity } from 'src/global.entity';
import { Column, Entity } from 'typeorm';

@Entity('blog')
export class Blog extends GlobalEntity {
  @Column()
  status: boolean;
}
