import { GlobalEntity } from 'src/global.entity';
import { Todo } from 'src/todo/entities/todo.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends GlobalEntity {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
