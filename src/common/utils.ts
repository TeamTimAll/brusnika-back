import bcrypt from 'bcrypt';
// import fs from "fs"
// import { promisify } from 'util';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */


export function validateHash(
  password: string | undefined,
  hash: string | undefined | null,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(
  getVar: () => TResult,
): string | undefined {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replaceAll(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName.split('.');

  return memberParts.at(-1);
};



// /**
//  * Check if a file exists at a given path.
//  *
//  * @param {string} path
//  *
//  * @returns {boolean}
//  */
// export const checkIfFileOrDirectoryExists = (path: string): boolean => {
//   return fs.existsSync(path);
// }


// /**
//  * Gets file data from a given path via a promise interface.
//  *
//  * @param {string} path
//  * @param {string} encoding
//  *
//  * @returns {Promise<Buffer>}
//  */
// export const getFile = async (
//   path: string,
//   encoding: string | Buffer | any ,
// ): Promise<string | Buffer | boolean> => {
//   const readFile = promisify(fs.readFile);


//   if(!encoding || encoding === undefined)  {
//        return  false 
//   };

//   return encoding ? readFile(path, encoding) : readFile(path, {});


// }

// /**
//  * Writes a file at a given path via a promise interface.
//  *
//  * @param {string} path
//  * @param {string} fileName
//  * @param {string} data
//  *
//  * @return {Promise<void>}
//  */

// export const generateImageUrl =   ( file : File ) : string  => {

//   const originalName  = file.name
//   const  host = "http://[::1]:3000/"
//   const fileName = `${host}/${originalName}`

//   return  fileName
// }


// export const createFile = async (
//   path: string,
//   data: File,
// ): Promise<boolean> => {
//     try {

//       if (!checkIfFileOrDirectoryExists(path)) {
//         fs.mkdirSync(path);
//       }

//       const fileName =  generateImageUrl(data)
    
//       const writeFile = promisify(fs.writeFile);
//       const fileBuffer :  ArrayBuffer  =  await data.arrayBuffer()
    
//       await  writeFile(`${path}/${fileName}`, fileBuffer, 'utf8');
//       return true 

//     } catch (error) {
//       console.log({
//           fileError : error 
//       })
//           return false 
//     }


// };

// /**
//  * Delete file at the given path via a promise interface
//  *
//  * @param {string} path
//  *
//  * @returns {Promise<void>}
//  */

// export const deleteFile = async (path: string): Promise<boolean> => {
//        try {

//         const unlink = promisify(fs.unlink);

//         await unlink(path);


//         return true 
        
//        } catch (error) {
//          console.log({
//            deleteFileError : error  
//          });
//         return false 
        
//        }
// };





