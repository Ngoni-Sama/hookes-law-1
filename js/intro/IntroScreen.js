// Copyright 2015-2020, University of Colorado Boulder

/**
 * The "Intro" screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import HookesLawConstants from '../common/HookesLawConstants.js';
import HookesLawIconFactory from '../common/view/HookesLawIconFactory.js';
import hookesLawStrings from '../hookesLawStrings.js';
import hookesLaw from '../hookesLaw.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

// strings
const introString = hookesLawStrings.intro;

class IntroScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = merge( {}, HookesLawConstants.SCREEN_OPTIONS, {
      name: introString,
      homeScreenIcon: HookesLawIconFactory.createIntroScreenIcon(),
      tandem: tandem
    } );

    super(
      () => new IntroModel( tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

hookesLaw.register( 'IntroScreen', IntroScreen );

export default IntroScreen;