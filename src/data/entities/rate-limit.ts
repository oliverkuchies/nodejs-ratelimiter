/**
 * This is where the data structure (entity) will sit
 */

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class RateLimit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  windowSeconds!: number;

  @Column()
  requestsAllowed!: number;

  @Column()
  routeRegex!: string;

  @Column({ type: "timestamp", nullable: true })
  ruleExpiry!: Date;
}
