import sinon from 'sinon';
import appKey from '../lib/index';

describe('request', function () {
  let _req;

  beforeEach(() => {
    _req = {
      get: sinon.stub()
    }
  });

  describe('without app id', () => {
    it('should not authorize', () => {
      _req.get.withArgs('app-key').returns('foo');
      const f = appKey('foo');
      f(_req).should.be.false;
    });
  });

  describe('without app key', () => {
    it('should not authorize', () => {
      _req.get.withArgs('app-id').returns('bar');
      const f = appKey('foo');
      f(_req).should.be.false;
    });
  });

  describe('with an invalid app key', () => {
    it('should not authorize', () => {
      _req.get.withArgs('x-app-name').returns('bar');
      _req.get.withArgs('x-app-key').returns('not foo');
      const f = appKey('foo');
      f(_req).should.be.false;
    });
  });

  describe('with a valid app key', () => {
    let _appId = 'foo', _key = 'bar', _filter;

    beforeEach(() => {
      _req.get.withArgs('x-app-id').returns(_appId);
      _req.get.withArgs('x-app-key').returns(_key);
      _filter = appKey(_key);
    });

    it('should authorize', () => {
      _filter(_req).should.not.be.false;
    });

    it('should set app name as subject', () => {
      const r = _filter(_req);
      r.sub.should.equal(_appId);
    });

    it('should set app-key as scheme', () => {
      const r = _filter(_req);
      r.scheme.should.equal('app-key');
    });
  });
});
