import { execSync } from 'child_process';

describe('# integration test', () => {
    beforeEach(() => {
        execSync('rm -rf testoutput');
        execSync('mkdir testoutput');
        execSync('git init', { cwd: 'testoutput' });
        execSync('git config user.email "you@example.com"', { cwd: 'testoutput' });
        execSync('git config user.name "Your Namer"', { cwd: 'testoutput' });
        execSync('git commit --allow-empty -m "Empty commit."', { cwd: 'testoutput' });
    });

    it('## should generate design and run spark commands', () => {
        let output = execSync('npm run build').toString();
        output = execSync('sgen -g `pwd`/dist/spark.min.js -d src/test/fixture/design.json -o testoutput').toString();
        output = output.replace(/info: Loaded generator .*spark.min.js.*/, '');
        output = output
            .replace(/warn: Please cherrypick changes from master-sgen-generated from .*/, '')
            .replace(/info: git cherry-pick .*/, '');
        expect(output).toMatchSnapshot();
        execSync('npm install', { cwd: 'testoutput', stdio: 'inherit' });
        execSync('npm run lint', { cwd: 'testoutput', stdio: 'inherit' });
        execSync('mvn compile', { cwd: 'testoutput', stdio: 'inherit' });
    });
});
