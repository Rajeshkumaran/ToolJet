import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad,
  BaseEntity,
} from 'typeorm';
import { User } from './user.entity';
import { AppVersion } from './app_version.entity';
import { DataQuery } from './data_query.entity';
import { DataSource } from './data_source.entity';

@Entity({ name: 'apps' })
export class App extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'slug', unique: true })
  slug: string;

  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'current_version_id' })
  currentVersionId: string;

  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => AppVersion, (appVersion) => appVersion.app, { eager: true, onDelete: 'CASCADE' })
  appVersions: AppVersion[];

  @OneToMany(() => DataQuery, (dataQuery) => dataQuery.app, { onDelete: 'CASCADE' })
  dataQueries: DataQuery[];

  @OneToMany(() => DataSource, (dataSource) => dataSource.app, { onDelete: 'CASCADE' })
  dataSources: DataSource[];

  public editingVersion;

  @AfterLoad()
  async afterLoad(): Promise<void> {
    if (this.currentVersionId) {
      this.editingVersion = this.appVersions
        ? this.appVersions.find((version) => version.id === this.currentVersionId)
        : {};
    } else {
      this.editingVersion = this.appVersions ? this.appVersions[0] : {};
    }
  }
}
