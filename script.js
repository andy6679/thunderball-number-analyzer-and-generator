// Thunderball Number Generator
class ThunderballGenerator {
  constructor() {
    this.mainMin = 1;
    this.mainMax = 39;
    this.thunderballMin = 1;
    this.thunderballMax = 14;
    this.totalMainNumbers = 5;
  }

  generateNumbers(options = {}) {
    const {
      lines = 5,
      odd = 'any',
      even = 'any',
      low = 'any',
      mid = 'any',
      high = 'any',
      distribution = 'any'
    } = options;

    const results = [];
    
    for (let i = 0; i < lines; i++) {
      let valid = false;
      let attempts = 0;
      const maxAttempts = 1000;
      
      while (!valid && attempts < maxAttempts) {
        attempts++;
        
        // Generate main numbers
        const mainNumbers = this.generateUniqueNumbers(
          this.totalMainNumbers, 
          this.mainMin, 
          this.mainMax
        ).sort((a, b) => a - b);
        
        // Generate thunderball
        const thunderball = this.getRandomNumber(
          this.thunderballMin, 
          this.thunderballMax
        );
        
        // Check if meets criteria
        valid = this.validateNumbers(mainNumbers, {
          odd, even, low, mid, high, distribution
        });
        
        if (valid) {
          // Calculate stats
          const oddCount = mainNumbers.filter(n => n % 2 === 1).length;
          const evenCount = this.totalMainNumbers - oddCount;
          
          let lowCount = 0, midCount = 0, highCount = 0;
          mainNumbers.forEach(n => {
            if (n <= 15) lowCount++;
            else if (n <= 30) midCount++;
            else highCount++;
          });
          
          results.push({
            mainNumbers,
            thunderball,
            stats: {
              oddCount,
              evenCount,
              lowCount,
              midCount,
              highCount
            }
          });
        }
      }
      
      if (attempts >= maxAttempts) {
        console.warn(`Could not generate valid line ${i+1} after ${maxAttempts} attempts`);
      }
    }
    
    return results;
  }

  generateUniqueNumbers(count, min, max) {
    const numbers = new Set();
    while (numbers.size < count) {
      numbers.add(this.getRandomNumber(min, max));
    }
    return Array.from(numbers);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  validateNumbers(numbers, criteria) {
    const { odd, even, low, mid, high, distribution } = criteria;
    
    // Check odd/even
    const oddCount = numbers.filter(n => n % 2 === 1).length;
    const evenCount = numbers.length - oddCount;
    
    if (odd !== 'any' && oddCount !== parseInt(odd)) return false;
    if (even !== 'any' && evenCount !== parseInt(even)) return false;
    
    // Check ranges
    let lowCount = 0, midCount = 0, highCount = 0;
    numbers.forEach(n => {
      if (n <= 15) lowCount++;
      else if (n <= 30) midCount++;
      else highCount++;
    });
    
    if (low !== 'any' && lowCount !== parseInt(low)) return false;
    if (mid !== 'any' && midCount !== parseInt(mid)) return false;
    if (high !== 'any' && highCount !== parseInt(high)) return false;
    
    // Check if ranges add up correctly
    if (low !== 'any' && mid !== 'any' && high !== 'any') {
      if (parseInt(low) + parseInt(mid) + parseInt(high) !== numbers.length) {
        return false;
      }
    }
    
    // Check distribution preference
    switch (distribution) {
      case 'low': if (lowCount < 3) return false; break;
      case 'mid': if (midCount < 3) return false; break;
      case 'high': if (highCount < 3) return false; break;
      case 'balanced': 
        if (lowCount < 1 || midCount < 1 || highCount < 1) return false; 
        break;
    }
    
    return true;
  }

  // Format numbers for display
  formatResult(result) {
    const { mainNumbers, thunderball, stats } = result;
    
    const formattedMain = mainNumbers.map(n => {
      let className = 'number-ball';
      if (n <= 15) className += ' low-number';
      else if (n <= 30) className += ' mid-number';
      else className += ' high-number';
      
      return `<div class="${className}">${n}</div>`;
    }).join('');
    
    const statsText = `
      ${stats.oddCount} odd / ${stats.evenCount} even | 
      ${stats.lowCount} low / ${stats.midCount} mid / ${stats.highCount} high
    `;
    
    return `
      <div class="number-line">
        <div class="main-numbers">${formattedMain}</div>
        <div class="number-ball thunderball">${thunderball}</div>
        <div class="stats">${statsText}</div>
      </div>
    `;
  }
}

// Example usage:
const generator = new ThunderballGenerator();

const options = {
  lines: 5,
  odd: 'any',
  even: 'any',
  low: 'any',
  mid: 'any',
  high: 'any',
  distribution: 'balanced'
};

const results = generator.generateNumbers(options);
const output = results.map(r => generator.formatResult(r)).join('');
document.getElementById('generatedNumbers').innerHTML = output;