import { execSync } from 'child_process';

describe('# integration test', () => {
    beforeEach(() => {
        execSync('rm -rf testoutput');
    });

    it('## should print help options', () => {
        let output = execSync('npm run build').toString();
        output = execSync('sgen -g `pwd`/dist/spark.min.js -h').toString();
        expect(output).toMatchSnapshot();
    });

    it('## should generate design and run spark commands', () => {
        let output = execSync('npm run build').toString();
        output = execSync('sgen -g `pwd`/dist/spark.min.js -d src/test/fixture/design.json -o testoutput').toString();
        output = output.replace(/info: Loaded generator .*spark.min.js.*/, '');
        expect(output).toMatchSnapshot();
        execSync('npm install', { cwd: 'testoutput', stdio: 'inherit' });
        execSync('npm run lint', { cwd: 'testoutput', stdio: 'inherit' });
        execSync('mvn compile', { cwd: 'testoutput', stdio: 'inherit' });
    });
});
