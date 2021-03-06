import MakerBase, { MakerOptions } from '@electron-forge/maker-base';
import { ForgePlatform } from '@electron-forge/shared-types';
import { flatAsync } from 'electron-osx-sign';

import { MakerPKGConfig } from './Config';

import path from 'path';

export default class MakerDMG extends MakerBase<MakerPKGConfig> {
  name = 'pkg';
  defaultPlatforms: ForgePlatform[] = ['darwin', 'mas'];

  isSupportedOnCurrentPlatform() {
    return process.platform === 'darwin';
  }

  async make({
    dir,
    makeDir,
    appName,
    packageJSON,
    targetPlatform,
  }: MakerOptions) {
    if (!['darwin', 'mas'].includes(targetPlatform)) {
      throw `The pkg maker only supports targetting "mas" and "darwin" builds.  You provided "${targetPlatform}"`;
    }

    const outPath = path.resolve(makeDir, `${appName}-${packageJSON.version}.pkg`);

    await this.ensureFile(outPath);

    const pkgConfig = Object.assign({}, this.config, {
      app: path.resolve(dir, `${appName}.app`),
      pkg: outPath,
      platform: targetPlatform,
    });
    await flatAsync(pkgConfig);

    return [outPath];
  }
}
