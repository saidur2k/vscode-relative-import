import { resolveFilePathFromURI, getDocumentDirectory, returnImportFilepathString } from '../filesystem.utils'
import * as assert from 'assert';

suite('resolveFilePathFromURI', () => {
    test('Should resolve a valid file path', () => {
        assert.equal('/test.js', resolveFilePathFromURI('/test.js'));
    })

    test('Should resolve a valid nested file path', () => {
        assert.equal('/abc/def.js', resolveFilePathFromURI('/abc/def.js'));
    })
})

suite('getDocumentDirectory', () => {
    test('Should resolve the directory for a file', () => {
        assert.equal('/', getDocumentDirectory('/test.js'));
    })

    test('Should resolve a valid nested directory for a file', () => {
        assert.equal('/abc', getDocumentDirectory('/abc/def.js'));
    })
})

suite('returnImportFilepathString', () => {
    test('Should resolve the relative path to target from source file in the same directory', () => {
        assert.equal('./target.js', returnImportFilepathString('/source.js', '/target.js'));
    })

    test('Should resolve the relative path to target from nested source to a target file up one directory', () => {
        assert.equal('../target.js', returnImportFilepathString('/abc/source.js', '/target.js'));
    })

    test('Should resolve the relative path to target from nested source file and nested target file', () => {
        assert.equal('../target-nested/target.js', returnImportFilepathString('/abc/source.js', '/target-nested/target.js'));
    })

    test('Should resolve the relative path to target from nested source file and nested target file', () => {
        assert.equal('../../target-nested/target.js', returnImportFilepathString('/abc/source-nested/source.js', '/target-nested/target.js'));
    })

    test('Should resolve the relative path to target from nested source file and nested target file', () => {
        assert.equal('../../../target-nested/target.js', returnImportFilepathString('/abc/source-nested/more-source-nested/source.js', '/target-nested/target.js'));
    })

    test('Should resolve the relative path to target from source to nested target file', () => {
        assert.equal('./target-nested/target.js', returnImportFilepathString('/source.js', '/target-nested/target.js'));
    })

    test('Should resolve the relative path to target from nested source file to nested target file two layers deep', () => {
        assert.equal('./more-nested/target.js', returnImportFilepathString('/nested/source.js', '/nested/more-nested/target.js'));
    })

    test('Should resolve the relative path to target from nested source file to nested target file three layers deep', () => {
        assert.equal('./more-nested/again-nested/target.js', returnImportFilepathString('/nested/source.js', '/nested/more-nested/again-nested/target.js'));
    })
})