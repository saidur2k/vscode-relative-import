const fs = require('fs');

const mapGitignoreRules = (gitignorePath: string) => {
    return fs.readFileSync(gitignorePath, {encoding: 'utf8'})
        .split('\n')
        // Filter out empty lines and comments.
        .filter((pattern: string) => !!pattern && pattern[0] !== '#')

        // '!' in .gitignore and glob mean opposite things so we need to swap it.
        .map((pattern: string) => pattern[0] === '!' ? ['', pattern.substring(1)] : ['', pattern])

        // Filter out hidden files/directories (i.e. starting with a dot).
        // .filter((patternPair: string) => {
        //     const pattern = patternPair[1];
        //     return pattern.indexOf('/.') === -1 && pattern.indexOf('.') !== 0;
        // })

        // Patterns not starting with '/' are in fact "starting" with '**/'. Since that would
        // catch a lot of files, restrict it to directories we check.
        // Patterns starting with '/' are relative to the project directory and glob would
        // treat them as relative to the OS root directory so strip the slash then.
        .map((patternPair: string) => {
            const pattern = patternPair[1];
            if (pattern[0] !== '/') {
                return [patternPair[0], `**/${ pattern }`];
            }
            return [patternPair[0], `**/${pattern.substring(1)}`];
        })

        // We don't know whether a pattern points to a directory or a file and we need files.
        // Therefore, include both `pattern` and `pattern/**` for every pattern in the array.
        .reduce((result: string[], patternPair: string[]) => {
            const pattern = patternPair.join('');
            result.push(pattern);
            result.push(`${ pattern }/**`);
            return result;
        }, []);
};

export const gitIgnoreRules = (gitIgnorePath: string) => {
    const gitIgnoreFileExists = fs.readFileSync(gitIgnorePath);
    let gitIgnoreRules: string[] = [];
    if (gitIgnoreFileExists) {
        gitIgnoreFileExists.toString().split('\n').map((row: string) => gitIgnoreRules.push(row));
        gitIgnoreRules = mapGitignoreRules(gitIgnorePath);
    }

    return gitIgnoreRules;
};