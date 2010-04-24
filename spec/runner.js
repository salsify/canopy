JSCLASS_PATH = 'vendor/js.class/build/min'
load(JSCLASS_PATH + '/loader.js')

JS.Packages(function() { with(this) {
    file('build/stake.js').provides('Stake')
    autoload(/^(.*)Spec$/, {from: 'spec', require: '$1'})
}})

require('JS.Test', 'Stake', function() {
    
    Stake.SpecHelper = new JS.Module({
      assertParse: function(tuple, actual) {
        this.__wrapAssertion__(function() {
          this.assertKindOf( Stake.SyntaxNode, actual )
          
          this.assertEqual( tuple[0], actual.textValue )
          this.assertEqual( tuple[1], actual.offset )
          
          if (!tuple[2]) return;
          this.assertEqual( tuple[2].length, actual.elements.length )
          for (var i = 0, n = tuple[2].length; i < n; i++)
            this.assertParse( tuple[2][i], actual.elements[i] )
          
          if (!tuple[3]) return;
          for (var key in tuple[3])
            this.assertParse( tuple[3][key], actual[key] )
        })
      }
    })
    
    require('Stake.CharClassParserSpec',
            'Stake.ChoiceParserSpec',
            'Stake.GrammarParserSpec',
            'Stake.LabelParserSpec',
            'Stake.MaybeParserSpec',
            'Stake.NotParserSpec',
            'Stake.RepeatParserSpec',
            'Stake.SequenceParserSpec',
            'Stake.StringParserSpec',
            'Stake.TypeParserSpec',
            
    JS.Test.method('autorun'))
})

