import {
  Tree,
  names,
  readJson,
  generateFiles,
  joinPathFragments,
  convertNxGenerator,
} from '@nrwl/devkit';

export function customElementGenerator(tree: Tree, opts: any) {
  const workspace = readJson(tree, 'angular.json');

  if (!opts.project) {
    opts.project = workspace.defaultProject;
  }

  console.log(opts);

  const project = workspace.projects[opts.project];
  console.log(project);
  const projectType = project.projectType === 'application' ? 'app' : 'lib';
  console.log(projectType);

  if (opts.path === undefined) {
    opts.path = `${project.sourceRoot}/${projectType}`;
  }
  console.log(opts);

  const { className, fileName } = names(opts.name);

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    joinPathFragments(opts.path),
    {
      className,
      name: fileName,
      tpl: '',
    }
  );
}

export const customElement = convertNxGenerator(customElementGenerator);

// import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
// import { libraryGenerator } from '@nrwl/workspace/generators';

// export default async function (host: Tree, schema: any) {
//   await libraryGenerator(host, { name: schema.name });
//   await formatFiles(host);
//   return () => {
//     installPackagesTask(host);
//   };
// }
