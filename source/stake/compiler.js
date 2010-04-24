Stake.extend({
  Compiler: new JS.Class({
    initialize: function(grammarText) {
      this._grammarText = grammarText;
    },
    
    parseTree: function() {
      return this._tree = this._tree ||
                          Stake.MetaGrammar.parse(this._grammarText);
    },
    
    toSexp: function(tree) {
      return this.parseTree().toSexp();
    },
    
    extend: {
      Grammar: new JS.Module({
        toSexp: function() {
          var sexp = ['grammar', this.grammar_name.identifier.textValue];
          this.elements[2].forEach(function(rule) {
            sexp.push(rule.grammar_rule.toSexp());
          });
          return sexp;
        }
      }),
      
      GrammarRule: new JS.Module({
        toSexp: function() {
          return ['rule', this.identifier.textValue, this.parsing_expression.toSexp()];
        }
      }),
      
      Atom: new JS.Module({
        toSexp: function() {
          var sexp = this.expression.toSexp();
          
          if (this.elements[0].identifier)
            sexp = ['label', this.elements[0].identifier.textValue, sexp];
          
          switch (this.elements[2].textValue) {
            case '?': sexp = ['maybe', sexp]; break;
            case '*': sexp = ['repeat', 0, sexp]; break;
            case '+': sexp = ['repeat', 1, sexp]; break;
          }
          return sexp;
        }
      }),
      
      NegatedAtom: new JS.Module({
        toSexp: function() {
          return ['not', this.atom.toSexp()];
        }
      }),
      
      SequenceExpression: new JS.Module({
        toSexp: function() {
          var sexp = ['sequence', this.first_expression.toSexp()];
          this.rest_expressions.forEach(function(part) {
            sexp.push(part.atom.toSexp());
          });
          return sexp;
        }
      }),
      
      StringExpression: new JS.Module({
        toSexp: function() {
          return ['string', this.elements[1].textValue];
        }
      })
    }
  })
});
