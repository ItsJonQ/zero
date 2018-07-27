import config from '../../jest'

test('Exports a config with testURL of http://localhost/', () => {
  expect(config.testURL).toBe('http://localhost/')
})

test('Defaults to node for the testEnvironment', () => {
  expect(config.testEnvironment).toBe('node')
})
