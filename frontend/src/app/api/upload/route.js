import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const curriculum = formData.get('curriculum')
    const standards = formData.get('standards')

    if (!curriculum || !standards) {
      return NextResponse.json(
        { error: 'Both curriculum and standards files are required' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filenames
    const curriculumName = `curriculum_${Date.now()}.pdf`
    const standardsName = `standards_${Date.now()}.pdf`

    // Save files
    const curriculumBuffer = Buffer.from(await curriculum.arrayBuffer())
    const standardsBuffer = Buffer.from(await standards.arrayBuffer())

    await writeFile(join(uploadDir, curriculumName), curriculumBuffer)
    await writeFile(join(uploadDir, standardsName), standardsBuffer)

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: {
        curriculum: curriculumName,
        standards: standardsName,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}