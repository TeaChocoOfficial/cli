#!/usr/bin/env node
import './command/command';
import { program } from 'commander';

// Configure the CLI program
program
    .name('tcc')
    .description('CLI tool to create project structure from YAML and JSON configuration')
    .version(process.version);

const args = process.argv;
// check if there are any arguments
if (args.length > 2) program.parse(args);

// If no arguments are provided, show help
if (!args.slice(2).length) program.outputHelp();
