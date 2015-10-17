__author__ = 'nnaskov'

import os
import unittest

from google.appengine.ext import testbed

class DatastoreTestCase(unittest.TestCase):

    def testTrue(self):
        self.assertEqual(1,1)

    def testToFail(self):
        self.assertEqual(1,2,"This test should fail")

if __name__ == '__main__':
    unittest.main()