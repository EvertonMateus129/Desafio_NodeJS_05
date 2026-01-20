/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { stringify } from "querystring";
import fs from "fs";

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * Server Activation
 */

  class Student {
    name: string;
    age: number;
    grade: number;

    constructor(name:string, age:number, grade:number) {
      this.name = name;
      this.age = age;
      this.grade = grade;
    }
  }
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);

  const readline = require("readline");
  const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let studentsInicial = 0;
  let totalStudents = 0;

 let studentsClass: Array<Student> = [];

  r1.question(
    "Quantos alunos têm na sala de aula?\n",
    (numberStudents: string) => {
      studentsInicial = parseInt(numberStudents);

      function askStudentsData() {
        if (totalStudents < studentsInicial) {
          r1.question("Qual o nome do aluno?\n", (studentName: string) => {
            r1.question("Qual a nota do aluno?\n", (studentGrade: string) => {
              r1.question("Qual a idade do aluno?\n", (studentAge: string) => {
                const student = new Student(
                  studentName,
                  parseFloat(studentAge),
                  parseFloat(studentGrade)
                )

                studentsClass.push(student)
                totalStudents++;
                askStudentsData();
              });
            });
          });
        } else {
          console.log(
            `A quantidade dos alunos são ${totalStudents}, e as informações deles são:`
          );
          console.log(studentsClass);

          const bestStudent = studentsClass.reduce((best, current) =>
            current.grade > best.grade ? current : best
          );

          console.log(
            `O aluno com a melhor nota é o ${bestStudent.name} com a nota ${bestStudent.grade}`
          );

          const header = "Nome, Nota, Idade, \n"
          
          const rows = studentsClass.map(student => `${student.name}, ${student.grade}, ${student.age}`).join("\n");

          const csvContent = header + rows;

          fs.writeFileSync("students.csv", csvContent, "utf-8")

          console.log("Arquivo students.csv criado com sucesso.")


          if (studentsClass.length >= 3) {
            const studentAverage = studentsClass.slice(0, 3);

            const sumGrades = studentsClass.reduce(
              (acc, studentsClass) => acc + studentsClass.grade,
              0
            );

            const sumAverage = sumGrades + studentAverage.length;

            console.log(
              `A soma dos alunos é: ${studentAverage
                .map((a) => a.name)
                .join(",")} é ${sumAverage.toFixed(2)} `
            );
          } else {
            console.log(`Não foi possível fazer a média por falta de alunos`);
          }

          r1.close();
        }
      }

      askStudentsData();
    }
  );
});
