/* eslint-disable prettier/prettier */
import { Entity } from 'typeorm';
import { GlobalEntity } from 'src/global.entity';
import { Column } from 'typeorm';

@Entity('blog-translations')
export class BlogTranslations extends GlobalEntity {
  @Column('uuid')
  blog_id: string;

  @Column('uuid')
  language_id: string;

  @Column()
  title: string;

  @Column()
  content: string;
}
