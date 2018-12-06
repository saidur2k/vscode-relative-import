import { resolveFilePathFromURI, getDocumentDirectory } from '../filesystem.utils';
import * as assert from 'assert';

suite('resolveFilePathFromURI', () => {
    test('Should resolve a valid file path', () => {
        assert.equal('/test.js', resolveFilePathFromURI('/test.js'));
    });

    test('Should resolve a valid nested file path', () => {
        assert.equal('/abc/def.js', resolveFilePathFromURI('/abc/def.js'));
    });
});

suite('getDocumentDirectory', () => {
    test('Should resolve the directory for a file', () => {
        assert.equal('/', getDocumentDirectory('/test.js'));
    });

    test('Should resolve a valid nested directory for a file', () => {
        assert.equal('/abc', getDocumentDirectory('/abc/def.js'));
    });
});