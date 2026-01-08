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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);

  const readline = require("readline");
  const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let students = 0;
  let totalStudents = 0;

  let studentsInfo: {
    studentName: string;
    studentGrade: number;
    studentAge: number;
  }[] = [];

  r1.question(
    "Quantos alunos têm na sala de aula?\n",
    (numberStudents: string) => {
      students = parseInt(numberStudents);

      function askStudentsData() {
        if (totalStudents < students) {
          r1.question("Qual o nome do aluno?\n", (studentName: string) => {
            r1.question("Qual a nota do aluno?\n", (studentGrade: string) => {
              r1.question("Qual a idade do aluno?\n", (studentAge: string) => {
                studentsInfo.push({
                  studentName,
                  studentGrade: parseFloat(studentGrade),
                  studentAge: parseFloat(studentAge),
                });
                totalStudents++;
                askStudentsData();
              });
            });
          });
        } else {
          console.log(
            `A quantidade dos alunos são ${totalStudents}, e as informações deles são:`
          );
          console.log(studentsInfo);

          const bestStudent = studentsInfo.reduce((best, current) =>
            current.studentGrade > best.studentGrade ? current : best
          );

          console.log(
            `O aluno com a melhor nota é o ${bestStudent.studentName} com a nota ${bestStudent.studentGrade}`
          );

          const header = "Nome, Nota, Idade, \n"
          
          const rows = studentsInfo.map(student => `${student.studentName}, ${student.studentGrade}, ${student.studentAge}`).join("\n");

          const csvContent = header + rows;

          fs.writeFileSync("students.csv", csvContent, "utf-8")

          console.log("Arquivo students.csv criado com sucesso.")


          if (studentsInfo.length >= 3) {
            const studentAverage = studentsInfo.slice(0, 3);

            const sumGrades = studentsInfo.reduce(
              (acc, studentsInfo) => acc + studentsInfo.studentGrade,
              0
            );

            const sumAverage = sumGrades + studentAverage.length;

            console.log(
              `A soma dos alunos é: ${studentAverage
                .map((a) => a.studentName)
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
