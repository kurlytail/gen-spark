import { execSync } from 'child_process';

describe('# integration test', () => {
    beforeEach(() => {
        execSync('rm -rf testoutput');
    });

    it('## should print help options', () => {
        const output = execSync('./scripts/sgen-spark.sh -h').toString();
        expect(output).toMatchSnapshot();
    });

    it('## should generate design', () => {
        const output = execSync('./scripts/sgen-spark.sh -d src/test/fixture/design.json -o testoutput').toString();
        expect(output).toMatchSnapshot();
    });

    it('## should generate design with merge', () => {
        let output = execSync('./scripts/sgen-spark.sh -d src/test/fixture/design.json -o testoutput').toString();
        expect(output).toMatchSnapshot();
        output = execSync('./scripts/sgen-spark.sh -d src/test/fixture/design.json -o testoutput').toString();
        expect(output).toMatchSnapshot();
    });

    it('## should generate design and run spark commands', () => {
        let output = execSync('./scripts/sgen-spark.sh -d src/test/fixture/design.json -o testoutput').toString();
        expect(output).toMatchSnapshot();
        output = execSync('npm install', { cwd: 'testoutput' }).toString();
        output = execSync('npm run lint', { cwd: 'testoutput' }).toString();
        output = execSync('mvn package', { cwd: 'testoutput' }).toString();
    });
});
