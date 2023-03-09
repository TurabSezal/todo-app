import { IsOptional } from 'class-validator';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  BeforeRemove,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class GlobalEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'NOW()',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'NOW()',
    onUpdate: 'NOW()',
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
  })
  deleted_at: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updated_at = new Date();
  }

  @BeforeRemove()
  @IsOptional()
  setDeletedAt() {
    this.deleted_at = new Date();
  }
}
