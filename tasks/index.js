// Basic tasks runner
export function runTask(taskName) {
  console.log(`Running task: ${taskName}`);
  
  // Add your task logic here
  // For example:
  switch(taskName) {
    case 'seed-db':
      console.log('Seeding database...');
      // Add database seeding logic
      break;
    case 'clean':
      console.log('Cleaning project...');
      // Add cleaning logic
      break;
    default:
      console.log(`Unknown task: ${taskName}`);
  }
}

// If this file is run directly
if (process.argv[1] === import.meta.url) {
  const taskName = process.argv[2];
  if (!taskName) {
    console.log('Please specify a task to run');
    process.exit(1);
  }
  
  runTask(taskName);
}