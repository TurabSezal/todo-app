/* eslint-disable prettier/prettier */
import { GlobalEntity } from 'src/global.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity('todo')
export class Todo extends GlobalEntity {
  @Column()
  title: string;

  @Column()
  dates: string;

  @Column({ default: false })
  completed: boolean;

  @Column()
  userId: string;

  @ManyToOne(() => User, (User) => User.todos)
  user: User;
  todo: Promise<User>;
}
