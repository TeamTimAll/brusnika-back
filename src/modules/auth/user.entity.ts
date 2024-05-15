import { Entity, Column } from 'typeorm';

@Entity()
export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

//   @Column({ nullable: true })
//   phoneNumber: string;

  @Column({ default: true })
  isActive: boolean;


  constructor(){
    //    this.id = ""
       this.email =""
       this.password=""
       this.username=""
    //    this.phoneNumber=""
       this.isActive = false 
  }
}
