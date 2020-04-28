import os = require('os');
import path = require('path');
import makeDir = require('make-dir');
import nock = require('nock');
import rimraf = require('rimraf');
import shell = require('shelljs');
import sinon = require('sinon');
import * as cg from '..';

import user = require('../user');

const tmpdir = path.join(os.tmpdir(), 'coge-user');

describe('module#user', function() {
  let prevCwd;
  let tmp;

  beforeEach(function() {
    prevCwd = process.cwd();
    tmp = tmpdir;
    makeDir.sync(path.join(tmpdir, 'subdir'));
    process.chdir(tmpdir);
    shell.exec('git init --quiet');
    shell.exec('git config --local user.name Coge');
    shell.exec('git config --local user.email coge@cogelab.com');
  });

  afterEach(function(done) {
    process.chdir(prevCwd);
    rimraf(tmpdir, done);
  });

  beforeEach(function() {
    process.chdir(tmp);
    sinon.spy(shell, 'exec');
    user.clear();
  });

  afterEach(function() {
    // @ts-ignore
    shell.exec.restore();
  });

  it('is exposed on the Base generator', () => {
    expect(require('../user')).toEqual(cg.user);
  });

  describe('.git', () => {
    describe('.name()', () => {
      it('is the name used by git', function() {
        expect(user.git.name()).toEqual('Coge');
      });

      it('cache the value', function() {
        user.git.name();
        user.git.name();
        // @ts-ignore
        expect(shell.exec.callCount).toEqual(1);
      });

      it('cache is linked to the CWD', function() {
        user.git.name();
        process.chdir('subdir');
        user.git.name();
        // @ts-ignore
        expect(shell.exec.callCount).toEqual(2);
      });
    });

    describe('.email()', () => {
      it('is the email used by git', function() {
        expect(user.git.email()).toEqual('coge@cogelab.com');
      });

      it('handle cache', function() {
        user.git.email();
        user.git.email();
        // @ts-ignore
        expect(shell.exec.callCount).toEqual(1);
      });

      it('cache is linked to the CWD', function() {
        user.git.email();
        process.chdir('subdir');
        user.git.email();
        // @ts-ignore
        expect(shell.exec.callCount).toEqual(2);
      });
    });
  });

  describe('.github', () => {
    describe('.username()', () => {
      beforeEach(() => {
        nock('https://api.github.com')
          .filteringPath(/q=[^&]*/g, 'q=XXX')
          .get('/search/users?q=XXX')
          .times(1)
          .reply(200, {
            items: [{ login: 'mockname' }]
          });
      });

      afterEach(() => {
        nock.restore();
      });

      it('is the username used by GitHub', function() {
        return user.github.username().then(res => {
          expect(res).toEqual('mockname');
        });
      });
    });
  });
});
