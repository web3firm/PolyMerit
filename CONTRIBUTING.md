# Contributing to PolyMerit

First off, thank you for considering contributing to PolyMerit! It's people like you that make PolyMerit such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Provide specific examples to demonstrate the concept**
* **Describe the current behavior and explain the expected behavior**

### Pull Requests

* Fill in the required template
* Follow the TypeScript/React coding style
* Include appropriate test cases
* Update documentation as needed
* End all files with a newline

## Development Process

### Setup

1. Fork the repo and create your branch from `main`
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`

### Coding Style

* Use TypeScript for type safety
* Follow the existing code style
* Use meaningful variable and function names
* Add comments for complex logic
* Keep functions small and focused

#### TypeScript Guidelines

```typescript
// ✅ Good
interface MarketData {
    id: string;
    volume: number;
    active: boolean;
}

function fetchMarket(id: string): Promise<MarketData> {
    // Implementation
}

// ❌ Bad
function getData(x: any): any {
    // Implementation
}
```

#### React Component Guidelines

```typescript
// ✅ Good - Functional component with proper typing
interface MarketCardProps {
    title: string;
    volume: string;
    yesPrice: number;
}

export default function MarketCard({ title, volume, yesPrice }: MarketCardProps) {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p>{volume}</p>
        </div>
    );
}
```

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Examples:
```
feat: add whale filtering by minimum size
fix: resolve price parsing issue in market cards
docs: update API integration documentation
style: format code with prettier
refactor: simplify market data fetching logic
```

### Testing

* Write tests for new features
* Ensure all tests pass before submitting PR
* Maintain or improve code coverage

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Documentation

* Update the README.md if needed
* Add JSDoc comments for functions
* Update API documentation for new endpoints

```typescript
/**
 * Fetches market data from the Polymarket API
 * @param marketId - The unique identifier for the market
 * @param options - Optional configuration for the request
 * @returns Promise resolving to market data
 */
async function getMarket(marketId: string, options?: RequestOptions): Promise<Market> {
    // Implementation
}
```

## Project Structure

```
src/
├── app/           # Next.js pages and API routes
├── components/    # Reusable React components
├── contexts/      # React context providers
├── lib/           # Utility functions and API clients
└── types/         # TypeScript type definitions
```

### Adding New Features

1. **Create an issue** describing the feature
2. **Wait for approval** from maintainers
3. **Create a branch** from main
4. **Implement the feature** following our guidelines
5. **Write tests** for the new functionality
6. **Submit a pull request** with a clear description

### Adding New API Endpoints

1. Create endpoint in `src/app/api/[endpoint]/route.ts`
2. Add corresponding function in `src/lib/polymarket.ts`
3. Update TypeScript interfaces in `src/lib/polymarket.ts`
4. Add example usage in README
5. Test thoroughly

Example:
```typescript
// src/app/api/example/route.ts
import { NextResponse } from 'next/server';
import { getExample } from '@/lib/polymarket';

export async function GET(req: Request) {
    try {
        const data = await getExample();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}
```

## Financial Contributions

We also welcome financial contributions. Please contact us at support@polymerit.app for more information.

## Questions?

Feel free to contact the project maintainers if you have any questions or need help getting started.

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.
